import type {ReadStream} from 'node:fs';
import type {Readable} from 'node:stream';
import type {ResponseEnvelope} from '@potentii/rest-envelopes';

export type EFileMetadataFields = '*' | 'type' | 'videoLengthSeconds' | 'isPlaybackMedia' | 'isVrVideo' | 'sizeBytes' | 'hash';
export type EFileMetadataType = 'image' | 'video' | 'video-stream' | 'unknown';

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
	type: EFileMetadataType | null | undefined;
	/** The total video length in seconds (if it's a video). */
	videoLengthSeconds: number | null | undefined;
	/** Whether this is playback media (e.g. a video or video stream). */
	isPlaybackMedia: boolean | null | undefined;
	/** Whether this is a VR video. */
	isVrVideo: boolean | null | undefined;
	/** The total size in bytes of the upload. */
	sizeBytes: number | null | undefined;
	/** The hash of the file content. */
	hash: string | null | undefined;
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
	 * @param fields The metadata fields to return
	 */
	getFileMetadata(accessToken: string, fileId: string, fields: EFileMetadataFields[] | null | undefined): Promise<ResponseEnvelope<MicroCdnGetMetadataRes>>;


	/**
	 * Uploads a file stream.
	 * It returns all the file metadata information.
	 * @param accessToken User access token
	 * @param contentStream The readable stream of the file
	 * @param contentType The file mimetype
	 */
	uploadFile(accessToken: string, contentStream: (ReadableStream | ReadStream | Readable | File | Blob), contentType: string|null|undefined): Promise<ResponseEnvelope<MicroCdnUploadFileRes>>;

}
