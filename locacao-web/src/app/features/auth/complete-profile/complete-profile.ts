import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { AddressService } from '../../../core/services/address';
import { NotificationService } from '../../../core/services/notification';
import { IndividualPerson } from '../../../core/models/individualPerson.model';
import { CompleteProfileService } from '../../../core/services/complete-profile-service';
import { Router } from '@angular/router';
import { LegalPerson } from '../../../core/models/legalPerson.mode';
import { Checkbox } from 'primeng/checkbox';
import { NgxMaskDirective } from "ngx-mask";
import { cpfValidator } from '../../../core/validators/cpf.validator';
import { licenseExpiryValidator, licenseNumberValidator } from '../../../core/validators/license.validator';
import { cnpjValidator } from '../../../core/validators/cnpj.validator';
@Component({
  selector: 'app-complete-profile',
  imports: [
    Card,
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    Button,
    ReactiveFormsModule,
    FloatLabel,
    InputText,
    DatePicker,
    Select,
    Checkbox,
    NgxMaskDirective
],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.scss',
})
export class CompleteProfile {
  activeStep = signal(1);
  personType = signal<'individual' | 'legal'>('individual');

  licenseCategories = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'AB', value: 'AB' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
  ];

  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private notification = inject(NotificationService)
  private completeProfileService = inject(CompleteProfileService)
  private router = inject(Router)

  nextStep() {
    this.activeStep.update((s) => s + 1);
  }
  prevStep() {
    this.activeStep.update((s) => s - 1);
  }

  onStepChange(value: number | undefined) {
    if (value) this.activeStep.set(value);
  }

  stepOneForm = this.fb.group({
    personType: ['individual', Validators.required],
  });

  selectPersonType(type: 'individual' | 'legal') {
    this.personType.set(type);
  }

  stepTwoIndividualForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    cpf: ['', [Validators.required, cpfValidator]],
    birthDate: [null, Validators.required],
    licenseNumber: ['', [licenseNumberValidator]],
    licenseExpiry: [null, [licenseExpiryValidator]],
    licenseCategory: [''],
    hasAtr: [false],
  });

  stepTwoLegalForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    cnpj: ['', [Validators.required, cnpjValidator]],
    tradeName: ['', Validators.required],
  });

  stepThreeForm = this.fb.group({
    zipCode: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  ngOnInit() {
    this.stepThreeForm.get('zipCode')?.valueChanges.subscribe(() => {
      this.resetAddressFields();
    });

    this.stepTwoIndividualForm.get('licenseNumber')?.valueChanges.subscribe(value => {
      this.updateLicenseValidators(value);
    });
  }

  private updateLicenseValidators(licenseNumber: string | null) {
    const expiry = this.stepTwoIndividualForm.get('licenseExpiry');
    const category = this.stepTwoIndividualForm.get('licenseCategory');
    const hasAtr = this.stepTwoIndividualForm.get('hasAtr');

    if (licenseNumber && licenseNumber.replace(/\D/g, '').length === 11) {
      // número preenchido — demais campos obrigatórios
      expiry?.setValidators([Validators.required, licenseExpiryValidator]);
      category?.setValidators([Validators.required]);
    } else {
      // número vazio — limpa e remove validadores
      expiry?.clearValidators();
      expiry?.reset();
      category?.clearValidators();
      category?.reset();
      hasAtr?.reset(false);
    }

    expiry?.updateValueAndValidity();
    category?.updateValueAndValidity();
  }

  onFillZipCode(){

    const zipCode = this.stepThreeForm.value.zipCode?.valueOf()
    if(!zipCode) {return
    }
    this.addressService.FindAddress(zipCode).subscribe(
      {
      next: (address) =>{
         this.stepThreeForm.patchValue({
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.district,
          city: address.city,
          state: address.state

         })

        if (address.street) this.stepThreeForm.get('street')?.disable();
        if (address.district) this.stepThreeForm.get('neighborhood')?.disable();
        if (address.city) this.stepThreeForm.get('city')?.disable();
        if (address.state) this.stepThreeForm.get('state')?.disable();

      },
      error: (err) => {
        this.notification.error(err.error || 'CEP não encontrado.');
      }
    });
  }

  private resetAddressFields() {
    const fields = ['street', 'neighborhood', 'city', 'state'];

    fields.forEach(field => {
      this.stepThreeForm.get(field)?.enable();
      this.stepThreeForm.get(field)?.reset();
    });
  }

  onSubmit() {
    if (!this.stepOneForm.valid) return this.goToStep(1);

    const stepTwoValid = this.personType() === 'individual'
      ? this.stepTwoIndividualForm.valid
      : this.stepTwoLegalForm.valid;

    if (!stepTwoValid) return this.goToStep(2);
    if (!this.stepThreeForm.valid) return this.goToStep(3);

    const request$ = this.personType() === 'individual'
      ? this.completeProfileService.completeIndividualProfile(this.buildIndividualData())
      : this.completeProfileService.completeLegalProfile(this.buildLegalData());

    request$.subscribe({
      next: () => {
        this.router.navigate(['/app'])
        this.notification.setPending('success', 'Sucesso', 'Cadastro Atualizado com sucesso!')
      },
      error: (err) => this.notification.error(err.error || 'Erro ao salvar perfil.')
    });
  }

  private buildIndividualData(): Omit<IndividualPerson, 'id'> {
    const f = this.stepTwoIndividualForm.value;

    const licenseNumber = f.licenseNumber?.replace(/\D/g, '');
    const license = licenseNumber?.length === 11 ? {
      number: f.licenseNumber!,
      expiry: this.formatDate(f.licenseExpiry!)!,
      category: f.licenseCategory!,
      hasAtr: f.hasAtr ?? false
    } : null;

    return {
      name: f.name!,
      email: f.email!,
      phone: f.phone!,
      cpf: f.cpf!,
      birthDate: this.formatDate(f.birthDate!)!,
      license,
      address: this.buildAddress()
    };
  }

  private buildLegalData(): Omit<LegalPerson, 'id'> {
    const f = this.stepTwoLegalForm.value;
    return {
      name: f.name!,
      email: f.email!,
      phone: f.phone!,
      cnpj: f.cnpj!,
      tradeName: f.tradeName!,
      address: this.buildAddress()
    };
  }
  private goToStep(step: number) {
    this.notification.error('Verifique se todos os dados foram preenchidos!', 'Cadastro Incompleto');
    this.activeStep.set(step);
  }

  private buildAddress() {
    const f = this.stepThreeForm.getRawValue();
    return {
      zipCode: f.zipCode!,
      street: f.street!,
      number: f.number!,
      complement: f.complement!,
      district: f.neighborhood!,
      city: f.city!,
      state: f.state!,
    };
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // "1993-09-02"
  }

}
