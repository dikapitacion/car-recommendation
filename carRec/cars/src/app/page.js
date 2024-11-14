import CarForm from '@/components/form'
import Landing from '@/components/landing'
export default function Home() {

  console.log(process.env.API_KEY)
  return (
    <main className=''>
      <Landing/>
      <CarForm/>
    </main>
  )
}
