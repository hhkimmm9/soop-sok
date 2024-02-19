import Link from 'next/link';

const Settings = () => {
  return (
    <div>
      <Link href={`/users/${1}/profile`}>Profile</Link>
    </div>
  )
}

export default Settings