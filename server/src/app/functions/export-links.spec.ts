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

    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

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
          link1.id,
          link1.originalUrl,
          link1.shortUrl,
          String(link1.accessCount),
          expect.any(String),
        ],
        [
          link2.id,
          link2.originalUrl,
          link2.shortUrl,
          String(link2.accessCount),
          expect.any(String),
        ],
        [
          link3.id,
          link3.originalUrl,
          link3.shortUrl,
          String(link3.accessCount),
          expect.any(String),
        ],
        [
          link4.id,
          link4.originalUrl,
          link4.shortUrl,
          String(link4.accessCount),
          expect.any(String),
        ],
        [
          link5.id,
          link5.originalUrl,
          link5.shortUrl,
          String(link5.accessCount),
          expect.any(String),
        ],
      ])
    )
  })
})
