import { z } from "zod";

const SearchMetadata = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  json_endpoint: z.string().optional(),
  markdown_endpoint: z.string().optional(),
  pixel_position_endpoint: z.string().optional(),
  created_at: z.string().optional(),
  processed_at: z.string().optional(),
  google_url: z.string().optional(),
  raw_html_file: z.string().optional(),
  total_time_taken: z.number().optional(),
}).passthrough();

const SearchParameters = z.object({
  engine: z.string().optional(),
  q: z.string().optional(),
  google_domain: z.string().optional(),
  device: z.string().optional(),
  tbm: z.string().optional(),
}).passthrough();

const SearchInformation = z.object({
  query_displayed: z.string().optional(),
  total_results: z.number().optional(),
  time_taken_displayed: z.number().optional(),
  news_results_state: z.string().optional(),
}).passthrough();

const NewsResult = z.object({
  position: z.number().optional(),
  link: z.string().optional(),
  title: z.string().optional(),
  source: z.string().optional(),
  date: z.string().optional(),
  published_at: z.string().optional(),
  snippet: z.string().optional(),
  favicon: z.string().optional(),
  thumbnail: z.string().optional(),
}).passthrough();

export const SerpApiNewsResponse = z.object({
  search_metadata: SearchMetadata.optional(),
  search_parameters: SearchParameters.optional(),
  search_information: SearchInformation.optional(),
  news_results: z.array(NewsResult).default([]),
}).passthrough();