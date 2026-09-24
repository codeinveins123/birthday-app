import {
    Modal,
    Stack,
    TextInput,
    NumberInput,
    Select,
    Button
} from "@mantine/core";

const months = [
    { value: "1", label: "Январь" },
    { value: "2", label: "Февраль" },
    { value: "3", label: "Март" },
    { value: "4", label: "Апрель" },
    { value: "5", label: "Май" },
    { value: "6", label: "Июнь" },
    { value: "7", label: "Июль" },
    { value: "8", label: "Август" },
    { value: "9", label: "Сентябрь" },
    { value: "10", label: "Октябрь" },
    { value: "11", label: "Ноябрь" },
    { value: "12", label: "Декабрь" }
];

function FriendModal({
    opened,
    onClose,
    onSubmit,
    editingFriend,
    name,
    setName,
    day,
    setDay,
    month,
    setMonth
}) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            title={
                editingFriend
                    ? "Редактировать друга"
                    : "Добавить друга"
            }
        >
            <form onSubmit={onSubmit}>
                <Stack>
                    <TextInput
                        label="Имя"
                        placeholder="Например, Алексей"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

                    <NumberInput
                        label="День"
                        placeholder="5"
                        min={1}
                        max={31}
                        value={day}
                        onChange={setDay}
                        required
                    />

                    <Select
                        label="Месяц"
                        placeholder="Выбери месяц"
                        data={months}
                        value={month}
                        onChange={setMonth}
                        required
                    />

                    <Button type="submit">
                        {editingFriend
                            ? "Сохранить"
                            : "Добавить"}
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default FriendModal;