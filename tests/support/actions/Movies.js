const { expect } = require('@playwright/test');

export class Movies {

    constructor(page) {
        this.page = page;
    }

    async isLoggedIn() {
        await expect(this.page).toHaveURL(/.*admin/);
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click();
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click();
    }

    async create(movie) {
        // 1. Vai para o formulário de cadastro
        await this.goForm();

        // 2. Preenche os campos de texto básicos
        await this.page.getByLabel('Titulo do filme').fill(movie.title);
        await this.page.getByLabel('Sinopse').fill(movie.overview);

        // 3. Seleciona a distribuidora (Combobox Customizado)
        await this.page.locator('#select_company_id .react-select__indicator').click();
        await this.page.locator('.react-select__option').filter({ hasText: movie.company }).click();

        // 4. Seleciona o ano de lançamento (Combobox Customizado)
        await this.page.locator('#select_year .react-select__indicator').click();
        await this.page.locator('.react-select__option').filter({ hasText: String(movie.release_year) }).click();

        // 5. Finaliza enviando o formulário
        await this.submit();
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target);
    }
}