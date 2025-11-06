import '@testing-library/jest-dom'
import * as React from 'react'

// some compiled JSX may expect React in global scope; provide it for tests
;(global as any).React = React

// add any global test setup here (e.g., mocks)
