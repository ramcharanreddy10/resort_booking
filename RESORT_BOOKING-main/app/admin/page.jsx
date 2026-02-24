import React from 'react'
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import AddProduct from '../components/AddProduct';
import AdminNav from '../components/AdminNav';
const AdminPage = async() => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }
  return (
    <div>
      <AdminNav userName={session.user.name} />
      <AddProduct />
    </div>
  )
}

export default AdminPage
