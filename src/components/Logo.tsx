import { Link } from 'next-view-transitions';
import React from 'react'

function Logo() {
  return (
    <Link href={'/'} className='font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-600 text-transparent bg-clip-text hover:cursor-pointer'>Form Builder</Link>
  )
}

export default Logo