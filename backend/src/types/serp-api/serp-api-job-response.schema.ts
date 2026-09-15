import { z } from "zod";

const AboutThisResultSource = z.object({
    description: z.string().optional(),
    source_info_link: z.string().optional(),
    icon: z.string().optional(),
}).passthrough();

const AboutThisResult = z.object({
    source: AboutThisResultSource.optional(),
    languages: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
}).passthrough();

const RichSnippet = z.object({
    top: z.object({
        detected_extensions: z.object({
            rating: z.number().optional(),
            reviews: z.number().optional(),
        }).passthrough().optional(),

        extensions: z.array(z.string()).optional(),
    }).passthrough().optional(),
}).passthrough();

const OrganicResult = z.object({
    position: z.number().optional(),
    title: z.string().optional(),
    link: z.string().optional(),
    redirect_link: z.string().optional(),
    displayed_link: z.string().optional(),
    favicon: z.string().optional(),
    snippet: z.string().optional(),
    snippet_highlighted_words: z.array(z.string()).optional(),

    about_this_result: AboutThisResult.optional(),

    about_page_link: z.string().optional(),
    about_page_serpapi_link: z.string().optional(),
    source: z.string().optional(),
    read_more_link: z.string().optional(),

    rich_snippet: RichSnippet.optional(),
}).passthrough();

const FilterOption = z.object({
    name: z.string().optional(),

    parameters: z.object({
        uds: z.string().optional(),
        q: z.string().optional(),
    }).passthrough().optional(),

    link: z.string().optional(),
    serpapi_link: z.string().optional(),
}).passthrough();

const Filter = z.object({
    name: z.string().optional(),

    parameters: z.object({
        uds: z.string().optional(),
        q: z.string().optional(),
    }).passthrough().optional(),

    link: z.string().optional(),
    serpapi_link: z.string().optional(),

    options: z.array(FilterOption).optional(),
}).passthrough();

const RelatedQuestion = z.object({
    question: z.string().optional(),
    type: z.string().optional(),
    page_token: z.string().optional(),
    serpapi_ai_overview_link: z.string().optional(),
    next_page_token: z.string().optional(),
    serpapi_link: z.string().optional(),
}).passthrough();

const AiOverview = z.object({
    page_token: z.string().optional(),
    serpapi_link: z.string().optional(),
}).passthrough();

const RelatedSearch = z.object({
    block_position: z.number().optional(),
    query: z.string().optional(),
    link: z.string().optional(),
    serpapi_link: z.string().optional(),
}).passthrough();

const Pagination = z.object({
    current: z.number().optional(),
    next: z.string().optional(),

    other_pages: z.record(
        z.string(),
        z.string()
    ).optional(),
}).passthrough();

const SerpApiPagination = z.object({
    current: z.number().optional(),
    next_link: z.string().optional(),
    next: z.string().optional(),

    other_pages: z.record(
        z.string(),
        z.string()
    ).optional(),
}).passthrough();

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
    organic_results_state: z.string().optional(),
    news_results_state: z.string().optional(),
}).passthrough();

export const SerpApiJobsResponse = z.object({
    search_metadata: SearchMetadata.optional(),
    search_parameters: SearchParameters.optional(),
    search_information: SearchInformation.optional(),

    related_questions: z.array(RelatedQuestion).optional(),

    ai_overview: AiOverview.optional(),

    organic_results: z.array(OrganicResult).optional(),

    filters: z.array(Filter).optional(),

    related_searches: z.array(RelatedSearch).optional(),

    pagination: Pagination.optional(),

    serpapi_pagination: SerpApiPagination.optional(),
}).passthrough();