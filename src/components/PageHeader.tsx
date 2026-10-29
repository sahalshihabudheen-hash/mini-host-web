type Props = {
  eyebrow: string
  title: string
  lead?: string
}

export default function PageHeader({ eyebrow, title, lead }: Props) {
  return (
    <header className="page-header">
      <div className="section__inner">
        <p className="section__eyebrow">{eyebrow}</p>
        <h1 className="page-header__title">{title}</h1>
        {lead && <p className="section__lead">{lead}</p>}
      </div>
    </header>
  )
}
