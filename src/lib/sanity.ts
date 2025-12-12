import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
});

export default sanityClient;

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export async function getDonationProjects() {
  const query = `*[_type == "project"] | order(order asc)`;
  return await sanityClient.fetch(query);
}

export async function getProjectById(id: string) {
  const query = `*[_type == "project" && _id == $id][0]`;
  return await sanityClient.fetch(query, { id });
}

export async function getTestimonials() {
  const query = `*[_type == "testimonial"] | order(order asc)`;
  return await sanityClient.fetch(query);
}

export async function getOrganizationSettings() {
  const query = `*[_type == "organizationSettings"][0]`;
  return await sanityClient.fetch(query);
}
