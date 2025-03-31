import { Step } from "./steps";

export interface templateAPIResponse {
    template: Step[]
}

enum IndexingStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    ERROR = 'ERROR',
    COMPLETED = 'COMPLETED'
};
export interface userAPIResponse {
    id: string,
    indexingStatus: IndexingStatus,
}

interface ReactResponse {
    steps: Step[]
}
interface ChatMessage {
    role: string;
    content: string;
}
interface ContextBody {
    components_used: number,
    query: string

}
export interface generateAPIResponse {
    status: string
    generated_code: ReactResponse
    conversation: ChatMessage[],
    context: ContextBody,
}

export interface trainingAPIResponse {
    status: string
    message: string
    details: githubDetails
}

interface githubDetails {
    github_url: string
    namespace: string
}