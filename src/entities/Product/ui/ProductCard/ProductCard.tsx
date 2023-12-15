import Image from 'next/image';
import { useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Card } from '@/shared/ui/Card';
import { StarRating } from '@/shared/ui/StarRating';
import { Tag } from '@/shared/ui/Tag';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { priceRu } from '@/shared/lib/priceRu/priceRu';
import { Devider } from '@/shared/ui/Devider';
import { numDeclination } from '@/shared/lib/numDeclination/numDeclination';
import VectorIcon from '@/shared/assets/icons/vector.svg';
import { ReviewList } from '@/entities/Review';
import { ProductModel } from '../../model/types/product';
import cls from './ProductCard.module.scss';

interface ProductCardProps {
    className?: string;
    product: ProductModel;
}

export const ProductCard = (props: ProductCardProps): JSX.Element => {
    const { className, product, ...otherProps } = props;

    const [isReviewOpened, setIsReviewOpened] = useState(false);
    const [addonDown, setAddonDown] = useState(false);

    const reviewsHandler = () => {
        setIsReviewOpened((prev) => !prev);
        setAddonDown((prev) => !prev);
    };

    return (
        <>
            <Card
                className={classNames(cls['product-card'], {}, [className])}
                {...otherProps}
            >
                <div className={cls.logo}>
                    <Image
                        src={process.env.NEXT_PUBLIC_DOMAIN + product.image}
                        alt={product.title}
                        width={70}
                        height={70}
                    />
                </div>
                <div className={cls.title}>{product.title}</div>
                <div className={cls.price}>
                    {priceRu(product.price)}
                    {product.oldPrice && (
                        <Tag color="green" className={cls['old-price']}>
                            {priceRu(product.price - product.oldPrice)}
                        </Tag>
                    )}
                </div>
                <div className={cls.credit}>
                    {priceRu(product.credit)}/
                    <span className={cls.month}>мес</span>
                </div>
                <div className={cls.rating}>
                    <StarRating
                        selectedStars={
                            product.reviewAvg ?? product.initialRating
                        }
                    />
                </div>
                <div className={cls.tags}>
                    {product.categories.map((category) => (
                        <Tag
                            className={cls.category}
                            key={category}
                            color="ghost"
                            size="m"
                        >
                            {category}
                        </Tag>
                    ))}
                </div>
                <div className={cls['price-title']}>цена</div>
                <div className={cls['credit-title']}>в кредит</div>
                <div className={cls['rate-title']}>
                    {product.reviewCount}{' '}
                    {numDeclination(product.reviewCount, [
                        'отзыв',
                        'отзыва',
                        'отзывов',
                    ])}
                </div>
                <Devider className={cls.hr} />
                <div className={cls.description}>{product.description}</div>
                <div className={cls.features}>
                    {product.characteristics.map((characteristic) => (
                        <div
                            className={cls.characteristic}
                            key={characteristic.name}
                        >
                            <span className={cls['characteristic-name']}>
                                {characteristic.name}
                            </span>
                            <span className={cls['characteristic-dots']}></span>
                            <span className={cls['characteristic-value']}>
                                {characteristic.value}
                            </span>
                        </div>
                    ))}
                </div>
                <div className={cls.specifics}>
                    {product.advantages && (
                        <div className={cls.advantges}>
                            <div className={cls['specifics-title']}>
                                Преимущества{' '}
                            </div>
                            {product.advantages}
                        </div>
                    )}
                    {product.disAdvantages && (
                        <div className={cls.disadvantges}>
                            <div className={cls['specifics-title']}>
                                Недостатки
                            </div>{' '}
                            {product.disAdvantages}
                        </div>
                    )}
                </div>
                <Devider className={classNames(cls.hr, {}, [cls.hr2])} />
                <div className={cls.actions}>
                    <Button>Узнать подробнее</Button>
                    <Button
                        variant="ghost"
                        addon={<Icon Svg={VectorIcon} />}
                        addonDown={addonDown}
                        onClick={reviewsHandler}
                    >
                        Читать отзывы
                    </Button>
                </div>
            </Card>
            <ReviewList
                isReviewOpened={isReviewOpened}
                reviews={product.reviews}
            />
        </>
    );
};
