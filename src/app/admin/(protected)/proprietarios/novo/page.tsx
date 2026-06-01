import OwnerForm from '../owner-form';

export default function NovoProprietarioPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Novo cadastro</p>
        <h2 className="font-display text-3xl font-bold text-ink">Cadastrar proprietário</h2>
      </div>
      <OwnerForm />
    </div>
  );
}
