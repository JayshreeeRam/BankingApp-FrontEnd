export class CloudinarySettings {
  cloudName: string;
  apiKey: string;
  apiSecret: string;

  constructor(cloudName: string, apiKey: string, apiSecret: string) {
    this.cloudName = cloudName;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
}
