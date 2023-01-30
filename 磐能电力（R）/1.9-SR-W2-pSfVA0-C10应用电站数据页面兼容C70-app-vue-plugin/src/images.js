import FineIcon from "../pluginTemp/images/fine.png";
import RainIcon from "../pluginTemp/images/rain.png";
import CloudyIcon from "../pluginTemp/images/cloudy.png";
import DrizzleIcon from "../pluginTemp/images/drizzle.png";
import DustStormsIcon from "../pluginTemp/images/duststorms.png";
import FlyAshIcon from "../pluginTemp/images/flyash.png";
import FogIcon from "../pluginTemp/images/fog.png";
import FreezingRainIcon from "../pluginTemp/images/freezingrain.png";
import HazeIcon from "../pluginTemp/images/haze.png";
import HeavyRainIcon from "../pluginTemp/images/heavyrain.png";
import HeavyRainfallIcon from "../pluginTemp/images/heavyrainfall.png";
import HeavySnowIcon from "../pluginTemp/images/heavysnow.png";
import LightRainIcon from "../pluginTemp/images/lightrain.png";
import LightSnowIcon from "../pluginTemp/images/lightsnow.png";
import MediumSnowIcon from "../pluginTemp/images/mediumsnow.png";
import ModeraterainIcon from "../pluginTemp/images/moderaterain.png";
import PartlyCloudyIcon from "../pluginTemp/images/partlycloudy.png";
import RainSnowIcon from "../pluginTemp/images/rainsnow.png";
import ShowerIcon from "../pluginTemp/images/shower.png";
import StormIcon from "../pluginTemp/images/storm.png";
import StrongWindIcon from "../pluginTemp/images/strongwind.png";
import ThundershowerIceIcon from "../pluginTemp/images/thundershowerice.png";
import TornadoIcon from "../pluginTemp/images/tornado.png";
import WindIcon from "../pluginTemp/images/wind.png";
export const WeatherIcons = {
  晴: FineIcon,
  少云: PartlyCloudyIcon,
  晴间多云: PartlyCloudyIcon,
  多云: PartlyCloudyIcon,
  阴: CloudyIcon,
  有风: WindIcon,
  平静: CloudyIcon,
  微风: WindIcon,
  和风: WindIcon,
  清风: WindIcon,
  "强风/劲风": StrongWindIcon,
  疾风: StrongWindIcon,
  大风: StrongWindIcon,
  烈风: StrongWindIcon,
  风暴: StormIcon,
  狂爆风: StormIcon,
  飓风: StormIcon,
  热带风暴: StormIcon,
  霾: HazeIcon,
  中度霾: HazeIcon,
  重度霾: HazeIcon,
  严重霾: HazeIcon,
  阵雨: ShowerIcon,
  雷阵雨: ShowerIcon,
  雷阵雨并伴有冰雹: ThundershowerIceIcon,
  小雨: LightRainIcon,
  中雨: ModeraterainIcon,
  大雨: HeavyRainIcon,
  暴雨: HeavyRainIcon,
  大暴雨: HeavyRainIcon,
  特大暴雨: HeavyRainIcon,
  强阵雨: HeavyRainfallIcon,
  强雷阵雨: HeavyRainfallIcon,
  极端降雨: HeavyRainfallIcon,
  "毛毛雨/细雨": DrizzleIcon,
  雨: RainIcon,
  "小雨-中雨": LightRainIcon,
  "中雨-大雨": ModeraterainIcon,
  "大雨-暴雨": HeavyRainIcon,
  "暴雨-大暴雨": HeavyRainIcon,
  "大暴雨-特大暴雨": HeavyRainIcon,
  雨雪天气: RainSnowIcon,
  雨夹雪: RainSnowIcon,
  阵雨夹雪: RainSnowIcon,
  冻雨: FreezingRainIcon,
  雪: LightSnowIcon,
  阵雪: LightSnowIcon,
  小雪: LightSnowIcon,
  中雪: MediumSnowIcon,
  大雪: HeavySnowIcon,
  暴雪: HeavySnowIcon,
  "小雪-中雪": LightSnowIcon,
  "中雪-大雪": MediumSnowIcon,
  "大雪-暴雪": HeavySnowIcon,
  浮尘: FlyAshIcon,
  扬沙: FlyAshIcon,
  沙尘暴: DustStormsIcon,
  强沙尘暴: DustStormsIcon,
  龙卷风: TornadoIcon,
  雾: FogIcon,
  浓雾: FogIcon,
  强浓雾: FogIcon,
  轻雾: FogIcon,
  大雾: FogIcon,
  特强浓雾: FogIcon,
  热: FineIcon,
  冷: CloudyIcon,
  未知: FineIcon,
};

export const DefaultIcon = RainIcon;
