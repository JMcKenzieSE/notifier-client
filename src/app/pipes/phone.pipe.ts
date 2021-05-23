import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'phoneNumber',
})
export class PhonePipe implements PipeTransform {
	public transform(value: string): string {
		if (!value || value.trim() === '') {
			return '';
		}
		value = value.replace(/\D/g, '');
		const len = value.length;
		const firstSection = value.slice(0, 3);
		const secondSection = value.slice(3, 6);
		const thirdSection = value.slice(6);
		return (
			`${len > 0 ? '(' : ''}${firstSection}` +
			`${len > 3 ? ')' : ''}${secondSection}` +
			`${len > 6 ? '-' : ''}${thirdSection}`
		);
	}
}
