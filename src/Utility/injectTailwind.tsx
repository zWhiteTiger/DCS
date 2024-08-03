import { ReactNode } from 'react';
import { StyledEngineProvider } from '@mui/system';

interface InjectTailwindProps {
    children: ReactNode;
}

export default function InjectTailwind({ children }: InjectTailwindProps): JSX.Element {
    return <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>;
}