import { Button } from '@/components/ui/button'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <Button className="hover:scale-105 transition-transform">Return Home</Button>
    </Link>
    </div>
  )
}