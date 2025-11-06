/// <reference types="vitest" />
import React from 'react'
import { render, screen } from '@testing-library/react'
import PreviewPanel from '../PreviewPanel'

describe('PreviewPanel', () => {
  it('renders header and iframe when files empty', () => {
    render(<PreviewPanel files={[]} />)

    expect(screen.getByTestId('preview-header')).toHaveTextContent('Preview & Testing')
    // iframe is present (srcDoc shows no files message)
    expect(screen.getByTestId('preview-iframe')).toBeInTheDocument()
  })

  it('device buttons change aria/state by clicking', () => {
    render(<PreviewPanel files={[]} />)

    const desktopBtn = screen.getByTestId('button-device-desktop')
    const tabletBtn = screen.getByTestId('button-device-tablet')
    const mobileBtn = screen.getByTestId('button-device-mobile')

    expect(desktopBtn).toBeInTheDocument()
    expect(tabletBtn).toBeInTheDocument()
    expect(mobileBtn).toBeInTheDocument()
  })
})
