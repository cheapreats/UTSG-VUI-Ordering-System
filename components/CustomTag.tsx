import React from 'react';
import styled from 'styled-components';
import { Mixins } from "@cheapreats/react-ui";
import { BaseStyles } from "@cheapreats/react-ui";
import { TagProps } from '@cheapreats/react-ui';

export const CustomTag: React.FC<TagProps> = ({
    children,
    ...props
}): React.ReactElement => (
    <TagDiv {...props}>
        {children}
    </TagDiv>
);

export default CustomTag;

const TagDiv = styled.span<TagProps>`
    ${Mixins.transition(['background-color', 'border-color', 'color'])}
    ${Mixins.flex('center')}
    ${({ theme, ...props }): string => {
        const color = Mixins.darken(theme.colors.input.default, 0.2);
        const hoverClickable = Mixins.clickable(theme.colors.primary, 0.1, [
            'background-color',
            'border-color',
        ]);
        return `
            ${BaseStyles.Main({
                padding: theme.dimensions.tag.padding,
                ...props,
            })}
            background-color: ${theme.colors["background"]};
            font-size: ${theme.dimensions.tag.fontSize};
            border: 1.5px solid ${color};
            color: ${theme.colors.text};
            &:hover {
                background-color: ${theme.colors.primary};
                border-color: ${theme.colors.primary};
                color: white;
            }
            ${hoverClickable}
            display: inline-flex;
            border-radius: 999px;
            font-weight: bold;
        `;
    }}
`;
