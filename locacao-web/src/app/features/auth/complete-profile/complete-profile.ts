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
import {Address} from '../../../core//models/address.model'
import { NotificationService } from '../../../core/services/notification';
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

  stepTwoForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    //individual
    cpf: [''],
    birthDate: [null],
    licenseNumber: [''],
    licenseExpiry: [''],
    licenseCategory: [''],
    hasAtr: [false],
    // legal
    cnpj: [''],
    tradeName: [''],
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
    console.log({
      type: this.personType(),
      ...this.stepTwoForm.value,
      ...this.stepThreeForm.value,
    });
  }
}
