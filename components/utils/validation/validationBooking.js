const validationBooking = ({listBooking, startDate, endDate}) => {
    return listBooking.filter(booking => {
        const startDataBooking = new Date(booking.startDataReservation).getTime();
        const endDataBooking = new Date(booking.endDataReservation).getTime();

        // Проверяем, что начало выбранного периода не попадает внутрь уже забронированного интервала
        const startsInside = startDate >= startDataBooking && startDate < endDataBooking;
        // Проверяем, что конец выбранного периода не попадает внутрь уже забронированного интервала
        const endsInside = endDate > startDataBooking && endDate <= endDataBooking;
        // Проверяем, что выбранный период не содержит внутри уже забронированный период
        const isInside = startDate <= startDataBooking && endDate >= endDataBooking;

        // Если одно из условий выполнено, бронирование недопустимо
        if (startsInside || endsInside || isInside) {
            return true;
        }
        // Если ни одно из условий не выполнено, бронирование допустимо
        return false;
    });
}

export default validationBooking;

