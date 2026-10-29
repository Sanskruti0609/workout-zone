import prisma from "../config/prisma.js";

export function createEnquiry({ website: _honeypot, ...data }) {
  return prisma.enquiry.create({ data });
}
