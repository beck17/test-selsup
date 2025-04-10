import React, {forwardRef, useImperativeHandle, useState} from 'react';

type paramType = 'string' | 'number' | 'boolean'

interface Param {
    id: number;
    name: string;
    type: paramType;
}

interface ParamValue {
    paramId: number;
    value: string;
}

interface Color {
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

interface ParamEditorProps {
    params: Param[];
    model: Model;
    onChange?: (model: Model) => void;
}

const modelInitialState: Model = {
    paramValues: [
        {paramId: 1, value: "Повседневное"},
        {paramId: 2, value: "Макси"},

    ],
    colors: [],
}

const params: Param[] = [
    {id: 1, name: "Назначение", type: "string"},
    {id: 2, name: "Длина", type: "string"},
]


const ParamEditor = forwardRef<{ getModel: () => Model }, ParamEditorProps>(
    ({params, model, onChange}, ref) => {
        const [currentModel, setCurrentModel] = useState(model);

        useImperativeHandle(ref, () => ({
            getModel: () => currentModel,
        }));

        const handleChangeInput = (paramId: number, value: string) => {
            setCurrentModel(prev => {
                const paramValues = prev.paramValues.filter(param => param.paramId !== paramId);
                paramValues.push({paramId, value});
                const newModel = {...prev, paramValues};
                onChange?.(newModel);
                return newModel;
            });
        };

        const getValue = (paramId: number) =>
            currentModel.paramValues.find(p => p.paramId === paramId)?.value || '';

        const renderInput = (param: Param) => {
            const value = getValue(param.id);
            switch (param.type) {
                case 'number':
                    return (
                        <input
                            type="number"
                            value={value}
                            onChange={e => handleChangeInput(param.id, e.target.value)}
                        />
                    );
                case 'boolean':
                    return (
                        <select
                            value={value}
                            onChange={e => handleChangeInput(param.id, e.target.value)}
                        >
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </select>
                    );
                default:
                    return (
                        <input
                            type="text"
                            value={value}
                            onChange={e => handleChangeInput(param.id, e.target.value)}
                        />
                    );
            }
        };

        return (
            <div>
                <h2>Редактор параметров</h2>
                {params.map(param => (
                    <div key={param.id}>
                        <label>{param.name}</label>
                        {renderInput(param)}
                    </div>
                ))}
            </div>
        );
    }
);

export default function App() {
    const [model, setModel] = useState<Model>(modelInitialState);

    const editorRef = React.useRef<{ getModel: () => Model }>(null);

    const handleClickSave = () => {
        console.log('Модель:', editorRef.current?.getModel());
    };

    return (
        <div>
            <ParamEditor
                ref={editorRef}
                params={params}
                model={model}
                onChange={setModel}
            />
            <button onClick={handleClickSave}>Сохранить</button>
        </div>
    );
}