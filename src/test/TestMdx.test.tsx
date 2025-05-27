import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TestMdx from './TestMdx.mdx'

// MDX 파일이 정상적으로 import되고 렌더링되는지 테스트

describe('TestMdx.mdx', () => {
  it('제목과 리스트, 커스텀 컴포넌트가 렌더링된다', () => {
    render(<TestMdx />)
    expect(screen.getByRole('heading', { name: /mdx 테스트/i })).toBeInTheDocument()
    expect(screen.getByText('이것은 MDX 환경이 잘 동작하는지 확인하기 위한 테스트 문서입니다.')).toBeInTheDocument()
    expect(screen.getByText('리스트 1')).toBeInTheDocument()
    expect(screen.getByText('리스트 2')).toBeInTheDocument()
    expect(screen.getByText('Hello from MDX!')).toBeInTheDocument()
  })
}) 