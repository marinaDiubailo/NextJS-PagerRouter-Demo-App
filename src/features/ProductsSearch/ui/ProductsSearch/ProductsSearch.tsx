import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Icon } from '@/shared/ui/Icon';
import SearchIcon from '@/shared/assets/icons/search.svg';
import cls from './ProductsSearch.module.scss';

interface ProductsSearchProps {
    className?: string;
}

export const ProductsSearch = memo(
    (props: ProductsSearchProps): JSX.Element => {
        const { className, ...otherProps } = props;
        const router = useRouter();

        const [search, setSearch] = useState<string>('');

        const navigateToSearchPage = () => {
            router.push({
                pathname: '/search',
                query: {
                    q: search,
                },
            });
        };

        const keyDownHandler = (
            event: React.KeyboardEvent<HTMLInputElement>,
        ) => {
            if (event.key === 'Enter') navigateToSearchPage();
        };

        return (
            <div
                className={classNames(cls.search, {}, [className])}
                {...otherProps}
            >
                <Input
                    placeholder="Поиск..."
                    className={cls.input}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={keyDownHandler}
                />
                <Button className={cls.button} onClick={navigateToSearchPage}>
                    <Icon Svg={SearchIcon} />
                </Button>
            </div>
        );
    },
);
