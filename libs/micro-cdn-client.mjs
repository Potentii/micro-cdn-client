import Joi from "joi";
import * as uuid from "uuid";
import {ResponseEnvelope} from "@potentii/rest-envelopes";


export default class MicroCdnClient {

	/**
	 * @type {string}
	 */
	#baseUrl;


	constructor(opts) {
		Joi.assert(opts, Joi.object({
			url: Joi.string().uri().required(),
		}).required());

		this.#baseUrl = opts.url;
	}


	// --------------------- PUBLIC API ---------------------



	async getFileMetadata(accessToken, fileId) {

		const response = await fetch(`${this.#baseUrl}/cdn/files/metadata/${fileId}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'X-Corr-Id': uuid.v4(),
			},
		});

		return ResponseEnvelope.from(await response.json());
	}


	async uploadFile(accessToken, contentStream, contentType) {
		let readableStream;

		// *Normalizing the input into a Web ReadableStream:
		if (typeof window !== 'undefined' && contentStream instanceof File) {
			// *Browser: Converting File object to ReadableStream:
			readableStream = contentStream.stream();
		} else if (contentStream?.prototype?.pipeThrough || contentStream instanceof ReadableStream) {
			// *Already a Web ReadableStream:
			readableStream = contentStream;
		} else if (contentStream && typeof contentStream.pipe === 'function') {
			// *Node.js legacy stream: Converting it to a Web ReadableStream:
			readableStream = ReadableStream.from(contentStream);
		} else {
			throw new Error('Unsupported file/stream format');
		}

		// *Uploading:
		const response = await fetch(`${this.#baseUrl}/cdn/files`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'X-Corr-Id': uuid.v4(),
				'Content-Type': contentType || 'application/octet-stream',
			},
			body: readableStream,
			// duplex: 'half' is required by the spec when sending a stream body via fetch
			duplex: 'half',
		});

		return ResponseEnvelope.from(await response.json());
	}


}
