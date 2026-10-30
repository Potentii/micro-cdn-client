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



	async getFileMetadata(accessToken, fileId, fields) {
		if(typeof fileId !== 'string' || !fileId?.trim?.()?.length)
			throw new TypeError(`MicroCdnClient.getFileMetadata: Invalid 'fileId'`);

		let query = new URLSearchParams();
		if(fields?.length){
			for(const field of fields){
				if(!field?.trim?.()?.length) continue;
				query.append('fields', field.trim());
			}
		}

		const queryString = query.size ? `?${query.toString()}` : '';

		const response = await fetch(`${this.#baseUrl}/cdn/files/metadata/${fileId}${queryString}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'X-Corr-Id': uuid.v4(),
			},
		});

		return ResponseEnvelope.from(await response.json());
	}


	async uploadFile(accessToken, contentStream, fileId) {
		if(typeof fileId !== 'string' || !fileId?.trim?.()?.length)
			throw new TypeError(`MicroCdnClient.uploadFile: Invalid 'fileId'`);

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
			throw new TypeError(`MicroCdnClient.uploadFile: Unsupported file/stream format`);
		}

		// *Uploading:
		const response = await fetch(`${this.#baseUrl}/cdn/files/${fileId}`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'X-Corr-Id': uuid.v4(),
			},
			body: readableStream,
			// duplex: 'half' is required by the spec when sending a stream body via fetch
			duplex: 'half',
		});


		return ResponseEnvelope.from(await response.json());
	}


	async moveFile(accessToken, fileId, newFileId) {
		if(typeof fileId !== 'string' || !fileId?.trim?.()?.length)
			throw new TypeError(`MicroCdnClient.moveFile: Invalid 'fileId'`);

		if(typeof newFileId !== 'string' || !newFileId?.trim?.()?.length)
			throw new TypeError(`MicroCdnClient.moveFile: Invalid 'newFileId'`);

		const response = await fetch(`${this.#baseUrl}/cdn/files/${fileId}`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'X-Corr-Id': uuid.v4(),
				'X-New-File-Id': newFileId,
			},
		});

		return ResponseEnvelope.from(await response.json());
	}


	async removeFile(accessToken, fileId) {
		if(typeof fileId !== 'string' || !fileId?.trim?.()?.length)
			throw new TypeError(`MicroCdnClient.removeFile: Invalid 'fileId'`);

		const response = await fetch(`${this.#baseUrl}/cdn/files/${fileId}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'X-Corr-Id': uuid.v4(),
			},
		});

		return ResponseEnvelope.from(await response.json());
	}


}
