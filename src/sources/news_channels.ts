import { is_filted_channels, collectM3uSource, get_channel_id } from "../utils"
import { converter, handle_m3u, ISource, TSources } from "./utils"

const content = `#EXTM3U url-tvg="https://live.fanmingming.com/e.xml"
#EXTINF:-1 tvg-id="CCTV13" tvg-name="CCTV13" group-title="新闻频道",CCTV-13 新闻
http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226537/index.m3u8
#EXTINF:-1 tvg-id="CGTNNews" tvg-name="CGTNNews" group-title="新闻频道",CGTN新闻
https://english-livebkali.cgtn.com/live/cgtn_news.m3u8
#EXTINF:-1 tvg-id="PhoenixChineseChannel" tvg-name="凤凰中文" group-title="新闻频道",凤凰中文
https://playtv-live.ifeng.com/live/06OLEGEGM4G_tv1.m3u8
#EXTINF:-1 tvg-id="PhoenixInfoNewsChannel" tvg-name="凤凰资讯" group-title="新闻频道",凤凰资讯
https://playtv-live.ifeng.com/live/06OLEEWQKN4_tv1.m3u8
#EXTINF:-1 tvg-id="CNN" tvg-name="CNN" group-title="新闻频道",CNN国际新闻
https://tve-live-lln.warnermediacdn.com/hls/live/586495/cnngo/cnn_main/VIDEO_0_3564000.m3u8
#EXTINF:-1 tvg-id="NHK" tvg-name="NHK" group-title="新闻频道",NHK世界
https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index_4M.m3u8
#EXTINF:-1 tvg-id="BloombergTV" tvg-name="Bloomberg" group-title="新闻频道",Bloomberg TV
https://liveprodapnortheast.global.ssl.fastly.net/ap1/Channel-APTVqvs-AWS-tokyo-1/Source-APTVqvs-1000-1_live.m3u8`;

export const news_filter: ISource["filter"] = (
    raw,
    caller,
    collectFn
): [string, number] => {
    const rawArray = handle_m3u(content)
    const invalidExp = /\#EXTVLCOPT:/

    const arr = rawArray.filter((r) => !invalidExp.test(r))

    let sourced: string[] = []
    let result = [arr[0]]

    for (let i = 1; i < arr.length; i += 2) {
        const id = get_channel_id(arr[i])

        if (is_filted_channels(id.trim())) {
            continue
        }

        if (caller === "normal" && collectFn) {
            collectM3uSource(arr[i], arr[i + 1], collectFn)
        }

        if (!sourced.includes(id)) {
            sourced.push(id)
            result.push(arr[i].trim())
            result.push(arr[i + 1])
        }
    }

    return [result.join("\n"), (result.length - 1) / 2]
}

export const news_sources: TSources = [
    {
        name: "News Channels",
        f_name: "news",
        url: "https://raw.githubusercontent.com/su469843/iptv-sources/main/src/sources/news_channels.ts",
        filter: news_filter
    }
];

export default news_sources;
