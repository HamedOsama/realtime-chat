const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = 'zrange' | 'sismember' | 'get' | 'smembers';

export async function fetchRedisData(command: Commands, ...args: (string | number)[]) {
  try {
    const RESTResponse = await fetch(`${upstashRedisRestUrl}/${command}/${args.join('/')}`, {
      headers: {
        Authorization: `Bearer ${upstashRedisRestToken}`,
      },
      cache: "no-store",
    })
    if (!RESTResponse.ok) {
      throw new Error(`Error fetching data from Redis: ${RESTResponse.statusText}`);
    }
    const data = await RESTResponse.json() as { result: string };
    return data.result;
  } catch (e) {
    return e;
  }
}