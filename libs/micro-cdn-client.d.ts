import type {ReadStream} from 'node:fs';
import type {Readable} from 'node:stream';
import type {ResponseEnvelope} from '@potentii/rest-envelopes';


export interface MicroCdnClientOptions {
	/** Base URL of the micro-cdn service (no trailing slash). */
	url: string;
}

export interface CommonFileAttributes {
	/** The upload ID. */
	id: string;
	/** The internal path of the main file for this upload. */
	internalFilePath: string;
	/** The main file type. */
	type: ('image' | 'video' | 'video-stream' | 'unknown');
	/** The total video length in seconds (if it's a video). */
	videoLengthSeconds: number | null | undefined;
	/** Whether this is playback media (e.g. a video or video stream). */
	isPlaybackMedia: boolean;
	/** Whether this is a VR video. */
	isVrVideo: boolean;
	/** The total size in bytes of the upload. */
	sizeBytes: number;
}

export interface MicroCdnUploadFileRes extends CommonFileAttributes {
}
export interface MicroCdnGetMetadataRes extends CommonFileAttributes {
}

export default class MicroCdnClient {

	#baseUrl: string;

	/**
	 * @param opts Options for configuring this client.
	 */
	constructor(opts: MicroCdnClientOptions);

	/**
	 * Gets the file metadata.
	 * @param accessToken User access token
	 * @param fileId The file ID
	 */
	getFileMetadata(accessToken: string, fileId: string): Promise<ResponseEnvelope<MicroCdnGetMetadataRes>>;


	/**
	 * Uploads a file stream.
	 * @param accessToken User access token
	 * @param contentStream The readable stream of the file
	 * @param contentType The file mimetype
	 */
	uploadFile(accessToken: string, contentStream: (ReadableStream | ReadStream | Readable | File | Blob), contentType: string|null|undefined): Promise<ResponseEnvelope<MicroCdnUploadFileRes>>;

}
