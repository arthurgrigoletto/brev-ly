import { randomUUID } from 'node:crypto'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportLinks } from './export-links'

describe('export links', () => {
  beforeEach(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'https://storage.com/image.jpg',
          }
        }),
      }
    })
  })

  it('should be able to export uploads', async () => {
    const uploadStup = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const upload1 = await makeLink()
    const upload2 = await makeLink()
    const upload3 = await makeLink()
    const upload4 = await makeLink()
    const upload5 = await makeLink()

    const sut = await exportLinks()

    const generatedCSVStream = uploadStup.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => chunks.push(chunk))

      generatedCSVStream.on('end', () =>
        resolve(Buffer.concat(chunks).toString('utf-8'))
      )

      generatedCSVStream.on('error', err => reject(err))
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'http://example.com/file.csv',
    })
    expect(csvAsArray).toEqual(
      expect.arrayContaining([
        ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created at'],
        [
          upload1.id,
          upload1.originalUrl,
          upload1.shortUrl,
          String(upload1.accessCount),
          expect.any(String),
        ],
        [
          upload2.id,
          upload2.originalUrl,
          upload2.shortUrl,
          String(upload2.accessCount),
          expect.any(String),
        ],
        [
          upload3.id,
          upload3.originalUrl,
          upload3.shortUrl,
          String(upload3.accessCount),
          expect.any(String),
        ],
        [
          upload4.id,
          upload4.originalUrl,
          upload4.shortUrl,
          String(upload4.accessCount),
          expect.any(String),
        ],
        [
          upload5.id,
          upload5.originalUrl,
          upload5.shortUrl,
          String(upload5.accessCount),
          expect.any(String),
        ],
      ])
    )
  })
})
