import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { brandConfig } from "@/config/brand";
import type { Product, Break, User, Order, Notification } from "./types";

// Products
export async function getProducts(constraints: QueryConstraint[] = []) {
  if (!db) return [];
  const q = query(collection(db, brandConfig.collections.products), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProduct(id: string) {
  if (!db) return null;
  const docRef = doc(db, brandConfig.collections.products, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null;
}

export async function addProduct(product: Omit<Product, "id">) {
  return await addDoc(collection(db, brandConfig.collections.products), product);
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const docRef = doc(db, brandConfig.collections.products, id);
  return await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, brandConfig.collections.products, id);
  return await deleteDoc(docRef);
}

// Breaks
export async function getBreaks(constraints: QueryConstraint[] = []) {
  const q = query(collection(db, brandConfig.collections.breaks), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Break));
}

export async function getBreak(id: string) {
  const docRef = doc(db, brandConfig.collections.breaks, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Break : null;
}

export async function addBreak(breakData: Omit<Break, "id">) {
  return await addDoc(collection(db, brandConfig.collections.breaks), breakData);
}

export async function updateBreak(id: string, data: Partial<Break>) {
  const docRef = doc(db, brandConfig.collections.breaks, id);
  return await updateDoc(docRef, data);
}

export async function deleteBreak(id: string) {
  const docRef = doc(db, brandConfig.collections.breaks, id);
  return await deleteDoc(docRef);
}

// Users
export async function getUser(id: string) {
  const docRef = doc(db, brandConfig.collections.users, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : null;
}

export async function updateUser(id: string, data: Partial<User>) {
  const docRef = doc(db, brandConfig.collections.users, id);
  return await updateDoc(docRef, data);
}

// Orders
export async function getOrders(userId?: string) {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (userId) {
    constraints.unshift(where("userId", "==", userId));
  }
  const q = query(collection(db, brandConfig.collections.orders), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function addOrder(order: Omit<Order, "id">) {
  return await addDoc(collection(db, brandConfig.collections.orders), order);
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const docRef = doc(db, brandConfig.collections.orders, id);
  return await updateDoc(docRef, data);
}

// Notifications
export async function addNotification(notification: Omit<Notification, "id">) {
  return await addDoc(collection(db, brandConfig.collections.notifications), notification);
}
