import { NextResponse } from 'next/server';
import { uploadToPinataFile, uploadToPinataJson } from '../../utils/UploadToPinata';


export async function POST(req: Request) {
    const date = new Date();
    const options: any = { weekday: 'short' as const, day: '2-digit', month: 'short', year: 'numeric' };
    const curr_date = date.toLocaleDateString("en-US", options);
    try {
        const data = await req.formData();
        const file = data.get('file');
        if (!file) {
            return new Response('No file found', { status: 400 });
        }
        console.log('data is', data);
        console.log('file is', file);

        const ImageURI = await uploadToPinataFile(file as File);
        console.log('Image URI is', ImageURI);
        console.log("Creating NFT Object")
        const NFTJsonObject = {
            "name": data.get('name'),
            "description": "NFT for Club Members",
            "image": `https://gateway.pinata.cloud/ipfs/` + ImageURI,
            "attributes": [
                {
                    "trait_type": "Role",
                    "value": data.get('role')
                },
                {
                    "trait_type": "Year",
                    "value": data.get('year')
                },
                {
                    "trait_type": "Issue Date",
                    "value": curr_date
                }
            ],
        };
        const json = JSON.stringify(NFTJsonObject);
        console.log('NFT JSON is', json);
        const nftURI = await uploadToPinataJson(json);
        console.log('NFT URI is', nftURI);

        return NextResponse.json({ ImageURI, nftURI });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}



