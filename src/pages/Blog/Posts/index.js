// POSTS -------------------------------------------------------------------------------------------------------------------------------------------|
import CppStorageArenasPost, { postMeta as cppStorageArenasMeta, postToc as cppStorageArenasToc } from "./CppStorageArenasPost.jsx"
import EpollTcpBackpressurePost, { postMeta as epollTcpBackpressureMeta, postToc as epollTcpBackpressureToc } from "./EpollTcpBackpressurePost.jsx"
import DeterministicAiGatewaysPost, { postMeta as deterministicAiGatewaysMeta, postToc as deterministicAiGatewaysToc } from "./DeterministicAiGatewaysPost.jsx"

// BLOG POST REGISTRY ------------------------------------------------------------------------------------------------------------------------------|
export const blogPosts = [
    { ...cppStorageArenasMeta, toc: cppStorageArenasToc, Component: CppStorageArenasPost },
    { ...epollTcpBackpressureMeta, toc: epollTcpBackpressureToc, Component: EpollTcpBackpressurePost },
    { ...deterministicAiGatewaysMeta, toc: deterministicAiGatewaysToc, Component: DeterministicAiGatewaysPost }
]
