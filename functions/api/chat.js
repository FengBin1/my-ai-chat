export async function onRequestPost(context) {
    try {
        // 1. 从 context.env 中安全地获取 API 密钥
        //    NEVER hardcode secrets in your code.
        const apiKey = context.env.SILICONFLOW_API_KEY;

        if (!apiKey) {
            return new Response('API key not configured', { status: 500 });
        }

        // 2. 从前端请求中获取数据
        const requestData = await context.request.json();

        // 3. 准备发往 SiliconFlow API 的请求
        const apiRequestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: requestData.model || "Qwen/Qwen3-8B",
                messages: requestData.messages,
                max_tokens: 512,
                enable_thinking: true,
                thinking_budget: 4096,
                min_p: 0.05,
                temp: 0.7,
                top_p: 0.7,
                top_k: 50,
                frequency_penalty: 0.5,
                n: 1,
                stream: false,
                stop: [],
                response_format: { "type": "text" }
            })
        };

        // 4. 发送请求到 SiliconFlow API
        const apiResponse = await fetch('https://api.siliconflow.cn/v1/chat/completions', apiRequestOptions);

        // 5. 将 SiliconFlow API 的响应直接返回给前端
        return new Response(apiResponse.body, {
            status: apiResponse.status,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Error in worker:', err);
        return new Response(err.toString(), { status: 500 });
    }
}
