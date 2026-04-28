import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';

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

  fb = inject(FormBuilder);

  stepOneForm = this.fb.group({
    personType: ['individual', Validators.required],
  });

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

  selectPersonType(type: 'individual' | 'legal') {
    this.personType.set(type);
  }

  nextStep() {
    this.activeStep.update((s) => s + 1);
  }
  prevStep() {
    this.activeStep.update((s) => s - 1);
  }

  onStepChange(value: number | undefined) {
    if (value) this.activeStep.set(value);
  }
  onSubmit() {
    console.log({
      type: this.personType(),
      ...this.stepTwoForm.value,
      ...this.stepThreeForm.value,
    });
  }
}
