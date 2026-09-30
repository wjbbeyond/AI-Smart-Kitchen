// @vitest-environment jsdom
import React from 'react';
import { expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
const { generate } = vi.hoisted(() => ({generate:vi.fn(() => new Promise(() => {}))}));
vi.mock('./services/geminiService', () => ({generateRecipes:generate}));
vi.mock('./components/ImageUpload', () => ({ImageUpload:({onImageSelected}:any) => <button onClick={() => onImageSelected('data:image/png;base64,AAAA')}>Fake image</button>}));
import App from './App';
it('suppresses duplicate generation while a request is pending', () => {
 const {getByRole,getByLabelText}=render(<App/>);
 fireEvent.click(getByRole('button',{name:'Fake image'}));
 fireEvent.change(getByLabelText('Google API Key'),{target:{value:'fake-personal-key'}});
 const submit=getByRole('button',{name:'生成食谱'});
 fireEvent.click(submit);fireEvent.click(submit);
 expect(generate).toHaveBeenCalledTimes(1);
 expect((submit as HTMLButtonElement).disabled).toBe(true);
});
