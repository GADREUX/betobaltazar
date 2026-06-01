import TenantForm from '../tenant-form';
export default function NovoInquilinoPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Novo cadastro</p>
        <h2 className="font-display text-3xl font-bold text-ink">Cadastrar cliente</h2>
      </div>
      <TenantForm />
    </div>
  );
}
