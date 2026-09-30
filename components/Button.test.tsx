// @vitest-environment jsdom
import React from 'react';
import { expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';
it('loading cannot be overridden by disabled=false', () => {
 let calls = 0;
 const {getByRole} = render(<Button isLoading disabled={false} onClick={() => calls++}>Generate</Button>);
 const button = getByRole('button') as HTMLButtonElement;
 expect(button.disabled).toBe(true);
 fireEvent.click(button);
 expect(calls).toBe(0);
});
