import { chat_endpoint } from "./chat/chat";
import { template_endpoint } from "./template/template";
import { fetch_github_details } from "./user/user";
import { generate_endpoint } from "./generate/generate";
import { find_components_endpoint } from "./library/library"
import { training_endpoint } from './train/train';

export { chat_endpoint, template_endpoint,training_endpoint, fetch_github_details as find_user_endpoint, generate_endpoint, find_components_endpoint };