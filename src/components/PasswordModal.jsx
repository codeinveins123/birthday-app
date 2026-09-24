import {
    Modal,
    Stack,
    PasswordInput,
    Button,
    Text
} from "@mantine/core";

function PasswordModal({
    opened,
    onClose,
    onSubmit,
    password,
    setPassword,
    error
}) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            title="Введите пароль"
        >
            <form onSubmit={onSubmit}>
                <Stack>
                    <PasswordInput
                        label="Пароль"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        error={error}
                        required
                    />

                    {error && (
                        <Text size="sm" c="red">
                            Неверный пароль
                        </Text>
                    )}

                    <Button type="submit">
                        Продолжить
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default PasswordModal;