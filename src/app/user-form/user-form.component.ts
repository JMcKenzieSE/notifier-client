import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { first, tap } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { Manager } from '../models/manager.model';
import { User } from '../models/user.model';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
    public userFormGroup: FormGroup = this.formBuilder.group({
        firstName: [
            '',
            [
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern('^[a-zA-z]*$'),
            ],
        ],
        lastName: [
            '',
            [
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern('^[a-zA-z]*$'),
            ],
        ],
        emailCheckbox: [false],
        email: ['', [Validators.maxLength(30), Validators.email]],
        phoneNumberCheckbox: [false],
        phoneNumber: [
            '',
            [
                Validators.maxLength(13),
                Validators.pattern('^\\([0-9]{3}\\)[0-9]{3}\\-[0-9]{4}$'),
            ],
        ],
        supervisor: [null, Validators.required],
    });

    get firstName() {
        return this.userFormGroup.get('firstName');
    }

    get lastName() {
        return this.userFormGroup.get('lastName');
    }

    get emailCheckbox() {
        return this.userFormGroup.get('emailCheckbox');
    }

    get email() {
        return this.userFormGroup.get('email');
    }

    get phoneNumberCheckbox() {
        return this.userFormGroup.get('phoneNumberCheckbox');
    }

    get phoneNumber() {
        return this.userFormGroup.get('phoneNumber');
    }

    get supervisor() {
        return this.userFormGroup.get('supervisor');
    }

    public supervisors: Manager[] = [];
    public submitted: boolean = false;
    public boxChecked: string = '';
    public showSuccess: boolean = false;
    public showFail: boolean = false;
    public selectedSupervisor: Manager = {};

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) { }

    public ngOnInit(): void {
        this.userFormGroup.setValidators([
            this.contactPreferenceValidator(),
            this.emailRequiredIfChecked(),
            this.phoneRequiredIfChecked(),
        ]);

        this.apiService
            .getSupervisors()
            .pipe(
                tap((supervisors) => {
                    this.supervisors = supervisors;
                }),
                first()
            )
            .toPromise();
    }

    public onSubmit(): void {
        this.submitted = true;
        if (this.userFormGroup.valid) {
            const user: User = {
                firstName: this.firstName?.value,
                lastName: this.lastName?.value,
                email: this.email?.value,
                phoneNumber: this.phoneNumber?.value,
                supervisor: this.supervisor?.value
            };
            this.apiService
                .submitUser(user)
                .pipe(
                    tap(() => {
                        this.selectedSupervisor = !!user?.supervisor ? user.supervisor : {};
                        this.resetForm();
                    }),
                    first()
                )
                .toPromise();
        } else {
            this.showSuccess = false;
            this.showFail = true;
        }
    }

    private resetForm() {
        this.submitted = false;
        this.showFail = false;
        this.showSuccess = true;
        this.firstName?.setValue('');
        this.lastName?.setValue('');
        this.email?.setValue('');
        this.emailCheckbox?.setValue(null);
        this.phoneNumber?.setValue('');
        this.phoneNumberCheckbox?.setValue(null);
        this.supervisor?.setValue(null);
        this.boxChecked = '';
        this.userFormGroup.markAsUntouched();
    }

    public checkboxClicked(box: string): void {
        this.email?.setValue(null);
        this.phoneNumber?.setValue(null);
        if (this.boxChecked === box) {
            this.boxChecked = '';
        } else {
            this.boxChecked = box;
        }
    }

    public setCheckbox(box: string, control: AbstractControl | null): boolean {
        const isChecked = box === this.boxChecked;
        control?.setValue(isChecked);
        return isChecked;
    }

    public contactPreferenceValidator(): ValidatorFn {
        return (): ValidationErrors | null => {
            return !this.phoneNumberCheckbox?.value && !this.emailCheckbox?.value
                ? { contactPrefernce: true }
                : null;
        };
    }

    public emailRequiredIfChecked(): ValidatorFn {
        return (): ValidationErrors | null => {
            return !!this.emailCheckbox?.value && !this.email?.value
                ? { emailRequired: true }
                : null;
        };
    }

    public phoneRequiredIfChecked(): ValidatorFn {
        return (): ValidationErrors | null => {
            const phoneRequired =
                this.phoneNumberCheckbox?.value &&
                (!this.phoneNumber?.value || this.phoneNumber?.value?.trim() === '');
            return phoneRequired ? { phoneRequired: true } : null;
        };
    }
}
