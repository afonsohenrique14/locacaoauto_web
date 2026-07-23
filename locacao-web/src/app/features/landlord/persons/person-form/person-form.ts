import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { NgxMaskDirective } from 'ngx-mask';
import { PersonService } from '../../../../core/services/PersonService';
import { AddressService } from '../../../../core/services/address';
import { NotificationService } from '../../../../core/services/notification';
import { IndividualPerson } from '../../../../core/models/individualPerson.model';
import { LegalPerson } from '../../../../core/models/legalPerson.mode';
import { cpfValidator } from '../../../../core/validators/cpf.validator';
import { cnpjValidator } from '../../../../core/validators/cnpj.validator';
import { licenseExpiryValidator, licenseNumberValidator } from '../../../../core/validators/license.validator';
import { FormGroup } from '@angular/forms';

type PersonFound = { type: 'individual'; data: IndividualPerson } | { type: 'legal'; data: LegalPerson };

@Component({
  selector: 'app-person-form',
  imports: [
    CardModule, ButtonModule, ReactiveFormsModule,
    FloatLabel, InputText, DatePicker, Select, Checkbox, NgxMaskDirective
  ],
  templateUrl: './person-form.html',
  styleUrl: './person-form.scss',
})
export class PersonForm {
  private fb = inject(FormBuilder);
  private personService = inject(PersonService);
  private addressService = inject(AddressService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  personFound = signal<PersonFound | null>(null);
  personType = signal<'individual' | 'legal' | null>(null);
  documentType = signal<'cpf' | 'cnpj' | null>(null);

  returnTo = this.route.snapshot.queryParamMap.get('returnTo');

  licenseCategories = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'AB', value: 'AB' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
  ];

  searchForm = this.fb.group({
    document: ['', Validators.required]
  });

  individualForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    cpf: ['', [Validators.required, cpfValidator]],
    birthDate: [null, Validators.required],
    licenseNumber: ['', [licenseNumberValidator]],
    licenseExpiry: [null, [licenseExpiryValidator]],
    licenseCategory: [''],
    hasAtr: [false],
    zipCode: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  legalForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    cnpj: ['', [Validators.required, cnpjValidator]],
    tradeName: ['', Validators.required],
    zipCode: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  ngOnInit() {
    this.individualForm.get('licenseNumber')?.valueChanges.subscribe(value => {
      this.updateLicenseValidators(value);
    });

    this.individualForm.get('zipCode')?.valueChanges.subscribe(() => {
      this.resetAddressFields(this.individualForm);
    });

    this.legalForm.get('zipCode')?.valueChanges.subscribe(() => {
      this.resetAddressFields(this.legalForm);
    });
  }

  onSearch() {
    const doc = this.searchForm.value.document?.replace(/\D/g, '') ?? '';
    if (!doc) return;

    this.loading.set(true);
    this.personFound.set(null);
    this.personType.set(null);

    if (doc.length === 11) {
      this.documentType.set('cpf');
      this.personService.findByCpf(this.searchForm.value.document!).subscribe({
        next: (person) => {
          this.personFound.set({ type: 'individual', data: person });
          this.loading.set(false);
        },
        error: () => {
          this.personType.set('individual');
          this.individualForm.patchValue({ cpf: this.searchForm.value.document! });
          this.individualForm.get('cpf')?.disable();
          this.loading.set(false);
        }
      });
    } else if (doc.length === 14) {
      this.documentType.set('cnpj');
      this.personService.findByCnpj(this.searchForm.value.document!).subscribe({
        next: (person) => {
          this.personFound.set({ type: 'legal', data: person });
          this.loading.set(false);
        },
        error: () => {
          this.personType.set('legal');
          this.legalForm.patchValue({ cnpj: this.searchForm.value.document! });
          this.legalForm.get('cnpj')?.disable();
          this.loading.set(false);
        }
      });
    } else {
      this.notification.warn('Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
      this.loading.set(false);
    }
  }

  onUseExisting() {
    const found = this.personFound();
    if (!found) return;
    this.navigateBack(found.data.id, found.data.name);
  }

  onSubmitIndividual() {
    if (!this.individualForm.valid)
      return this.notification.error('Verifique os dados preenchidos.', 'Cadastro Incompleto');

    const f = this.individualForm.getRawValue();
    const licenseNumber = f.licenseNumber?.replace(/\D/g, '');
    const license = licenseNumber?.length === 11 ? {
      number: f.licenseNumber!,
      expiry: this.formatDate(f.licenseExpiry!)!,
      category: f.licenseCategory!,
      hasAtr: f.hasAtr ?? false
    } : null;

    const data: Omit<IndividualPerson, 'id'> = {
      name: f.name!,
      email: f.email!,
      phone: f.phone!,
      cpf: f.cpf!,
      birthDate: this.formatDate(f.birthDate!)!,
      license,
      address: {
        zipCode: f.zipCode!,
        street: f.street!,
        number: f.number!,
        complement: f.complement!,
        district: f.neighborhood!,
        city: f.city!,
        state: f.state!,
      }
    };

    this.personService.createIndividual(data).subscribe({
      next: (person) => {
        this.notification.success('Cliente cadastrado com sucesso.');
        this.navigateBack(person.id, person.name);
      },
      error: (err) => this.notification.error(err.error || 'Erro ao cadastrar cliente.')
    });
  }

  onSubmitLegal() {
    if (!this.legalForm.valid)
      return this.notification.error('Verifique os dados preenchidos.', 'Cadastro Incompleto');

    const f = this.legalForm.getRawValue();

    const data: Omit<LegalPerson, 'id'> = {
      name: f.name!,
      email: f.email!,
      phone: f.phone!,
      cnpj: f.cnpj!,
      tradeName: f.tradeName!,
      address: {
        zipCode: f.zipCode!,
        street: f.street!,
        number: f.number!,
        complement: f.complement!,
        district: f.neighborhood!,
        city: f.city!,
        state: f.state!,
      }
    };

    this.personService.createLegal(data).subscribe({
      next: (person) => {
        this.notification.success('Cliente cadastrado com sucesso.');
        this.navigateBack(person.id, person.name);
      },
      error: (err) => this.notification.error(err.error || 'Erro ao cadastrar cliente.')
    });
  }

  onFillZipCode(form: 'individual' | 'legal') {
    const target: FormGroup = form === 'individual' ? this.individualForm : this.legalForm;
    const zipCode = target.get('zipCode')?.value;
    if (!zipCode) return;

    this.addressService.FindAddress(zipCode).subscribe({
      next: (address) => {
        target.patchValue({
          street: address.street,
          complement: address.complement,
          neighborhood: address.district,
          city: address.city,
          state: address.state,
        });

        if (address.street) target.get('street')?.disable();
        if (address.district) target.get('neighborhood')?.disable();
        if (address.city) target.get('city')?.disable();
        if (address.state) target.get('state')?.disable();
      },
      error: () => this.notification.error('CEP não encontrado.')
    });
  }

  onCancel() {
    this.notification.setPending('warn', 'Atenção', 'Operação cancelada.');
    this.router.navigate([this.returnTo ?? '/app/landlord/persons']);
  }

  maskDocument(found: PersonFound): string {
    if (found.type === 'individual') {
      const cpf = found.data.cpf;
      return cpf.replace(/(\d{3})\.\d{3}\.\d{3}-(\d{2})/, '$1.***.***-$2');
    } else {
      const cnpj = found.data.cnpj;
      return cnpj.replace(/(\d{2})\.\d{3}\.\d{3}\/\d{4}-(\d{2})/, '$1.***.***/**-$2');
    }
  }

  maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    return `${user[0]}***@${domain}`;
  }

  maskPhone(phone: string): string {
    return phone.replace(/(\(\d{2}\))\s?\d{4,5}-(\d{4})/, '$1 ****-$2');
  }

  private navigateBack(personId: string, personName: string) {
    if (this.returnTo) {
      this.router.navigate([this.returnTo], {
        queryParams: { tenantId: personId, tenantName: personName }
      });
    } else {
      this.notification.setPending('success', 'Sucesso', 'Cliente cadastrado com sucesso!');
      this.router.navigate(['/app/landlord/persons']);
    }
  }

  private resetAddressFields(form: FormGroup) {
    ['street', 'neighborhood', 'city', 'state'].forEach(field => {
      form.get(field)?.enable();
      form.get(field)?.reset();
    });
  }

  private updateLicenseValidators(licenseNumber: string | null) {
    const expiry = this.individualForm.get('licenseExpiry');
    const category = this.individualForm.get('licenseCategory');
    const hasAtr = this.individualForm.get('hasAtr');

    if (licenseNumber && licenseNumber.replace(/\D/g, '').length === 11) {
      expiry?.setValidators([Validators.required, licenseExpiryValidator]);
      category?.setValidators([Validators.required]);
    } else {
      expiry?.clearValidators();
      expiry?.reset();
      category?.clearValidators();
      category?.reset();
      hasAtr?.reset(false);
    }

    expiry?.updateValueAndValidity();
    category?.updateValueAndValidity();
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }
}
