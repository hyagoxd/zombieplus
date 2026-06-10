const { test, expect } = require('../support');
const { faker } = require('@faker-js/faker');



test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await page.toast.containText(message);
});

test('não deve cadastrar quando o email já existe', async ({ page, request }) => {

  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();
  
  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  });

  expect(newLead.ok()).toBeTruthy();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.';
  await page.toast.containText(message);
});

test('deve Exibir mensagem de erro ao tentar cadastrar lead sem preencher o campo email com formato inválido', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('Hyago Garcia', 'hyago.garcia.com');

  await page.leads.alertHaveText('Email incorreto');
});

test('deve Exibir mensagem de erro ao tentar cadastrar lead sem preencher o campo nome', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', 'hyago.garcia@teste.com');

  await page.leads.alertHaveText('Campo obrigatório');
});

test('deve Exibir mensagem de erro ao tentar cadastrar lead sem preencher o campo email', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('Hyago Garcia', '');

  await page.leads.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar lead sem preencher os campos ', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', '');

  await page.leads.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ]);
});