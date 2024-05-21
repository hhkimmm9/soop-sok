import { auth, db } from '@/db/firebase';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('auth-token');

export async function getUsers() {
  try {
    const res = await fetch(``, {

    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function getUser() {
  try {
    const res = await fetch(``, {

    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function storeUser(
  displayName: string, email: string, photoURL: string, uid: string
) {
  console.log("storeUsers", uid);
  try {
    const res = await fetch(`/api/users/${uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        displayName, email, photoURL
      }),
    });
    const users = await res.json();
    console.log(users);
    return users;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateLastLogin(uid: string) {
  try {
    const res = await fetch(`/api/users/${uid}?type=signin`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
    });
    const updatedUser = await res.json();
    console.log(updatedUser);
    return updatedUser;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateUser() {
  try {
    const res = await fetch(``, {
      
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function deleteUser() {
  try {
    const res = await fetch(``, {
      
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};