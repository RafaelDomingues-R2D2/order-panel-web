import { Helmet } from 'react-helmet-async'

export function Dashboard() {

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1>Dashboard</h1>
      </div>
    </>
  )
}
