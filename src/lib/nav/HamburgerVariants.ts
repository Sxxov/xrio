import { type Button, ButtonVariants } from '@sxxov/sv/button';
import type { Variants } from '@sxxov/sv/common/types';

export const HamburgerVariants = {
	Topping: {
		...ButtonVariants.Secondary,
		width: '100%',
	},
} as const satisfies Variants<Button>;
