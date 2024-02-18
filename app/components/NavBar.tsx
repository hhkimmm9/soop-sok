import Link from 'next/link';

const NavBar = () => {
  return (
    <div className="
      fixed bottom-0 w-full h-14
      border-t border-black
      px-12 flex justify-between items-center
    ">
      <Link href=''
        className="bg-stone-200 rounded-full px-3
      ">1</Link>
      <Link href=''
        className="bg-stone-200 rounded-full px-3
      ">2</Link>
      <Link href=''
        className="bg-stone-200 rounded-full px-3
      ">3</Link>
      <Link href=''
        className="bg-stone-200 rounded-full px-3
      ">4</Link>
    </div> 
  )
}

export default NavBar