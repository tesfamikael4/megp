'use client';
import React from 'react';
import { useObject, FormContext, InputTypes } from 'react-hook-form-jsonschema';

import { personSchema, UISchema } from './schemas';
import { logger } from '@megp/core-fe';
import { Box, Button, Checkbox, Flex, Select, TextInput } from '@mantine/core';
import selectStyle from './select.module.scss';
// function SpecializedObject(props: any) {
//   switch (props.baseObject.type) {
//     case InputTypes.input: {
//       return (
//         <>
//           <label {...props.baseObject.getLabelProps()}>
//             {props.baseObject.getObject().title}
//           </label>
//           <input {...props.baseObject.getInputProps()} />
//           {/* <TextInput
//             label={props.baseObject.getObject().title}
//             {...props.baseObject.getInputProps()}
//           /> */}
//         </>
//       );
//     }
//     case InputTypes.radio: {
//       return (
//         <>
//           <label {...props.baseObject.getLabelProps()}>
//             {props.baseObject.getObject().title}
//           </label>
//           {props.baseObject.getItems().map((value, index) => {
//             return (
//               <label
//                 {...props.baseObject.getItemLabelProps(index)}
//                 key={`${value}${index}`}
//               >
//                 {value}
//                 <input {...props.baseObject.getItemInputProps(index)} />
//               </label>
//             );
//           })}
//         </>

//         // <>
//         //   <label {...props.baseObject.getLabelProps()}>
//         //     {props.baseObject.getObject().title}
//         //   </label>
//         //   {props.baseObject.getItems().map((value, index) => {
//         //     return (
//         //       <Checkbox
//         //         {...props.baseObject.getItemInputProps(index)}
//         //         label={value}
//         //         key={`${value}${index}`}
//         //       />
//         //     );
//         //   })}
//         // </>
//       );
//     }
//     case InputTypes.select: {
//       return (
//         <>
//           <label {...props.baseObject.getLabelProps()}>
//             {props.baseObject.getObject().title}
//           </label>
//           <select {...props.baseObject.getSelectProps()}>
//             {props.baseObject.getItems().map((value, index) => {
//               return (
//                 <option
//                   {...props.baseObject.getItemOptionProps(index)}
//                   key={`${value}${index}`}
//                 >
//                   {value}
//                 </option>
//               );
//             })}
//           </select>
//         </>

//         // <Select
//         //   {...props.baseObject.getSelectProps()}
//         //   data={props.baseObject.getItems().map((value, index) => ({
//         //     value: index,
//         //     label: value,
//         //   }))}
//         // />
//       );
//     }
//     default:
//       return <></>;
//   }
// }

function SpecializedObject(props: any) {
  switch (props.baseObject.type) {
    case InputTypes.input: {
      return (
        <>
          <TextInput
            label={props.baseObject.getObject().title}
            {...props.baseObject.getInputProps()}
            className="w-full"
          />
        </>
      );
    }
    case InputTypes.radio: {
      return (
        // <>
        //   <label {...props.baseObject.getLabelProps()}>
        //     {props.baseObject.getObject().title}
        //   </label>
        //   {props.baseObject.getItems().map((value, index) => {
        //     return (
        //       <label
        //         {...props.baseObject.getItemLabelProps(index)}
        //         key={`${value}${index}`}
        //       >
        //         {value}
        //         <input {...props.baseObject.getItemInputProps(index)} />
        //       </label>
        //     );
        //   })}
        // </>
        <>
          {props.baseObject.getItems().map((value, index) => {
            return (
              <Checkbox
                {...props.baseObject.getItemInputProps(index)}
                label={value}
                key={`${value}${index}`}
              />
            );
          })}
        </>
      );
    }
    case InputTypes.select: {
      return (
        <>
          <Flex direction={'column'}>
            <label
              {...props.baseObject.getLabelProps()}
              className="font-semibold"
            >
              {props.baseObject.getObject().title}
            </label>
            <select
              {...props.baseObject.getSelectProps()}
              className="p-2 rounded-sm border border-gray-300 w-full"
            >
              {props.baseObject.getItems().map((value, index) => {
                return (
                  <option
                    {...props.baseObject.getItemOptionProps(index)}
                    key={`${value}${index}`}
                    className="pt-4 pl-12 m-6 hover:bg-gray-100"
                    style={{ padding: '30px' }}
                  >
                    {value.toString()}
                  </option>
                );
              })}
            </select>
          </Flex>
          {/* <Select
            label={props.baseObject.getObject().title}
            {...props.baseObject.getSelectProps()}
            data={props.baseObject.getItems().map((value, index) => ({
              value: value.toString(),
              label: value,
            }))}
            onChange={(value) => {
              logger.log(value);
              register(value, value);
            }}
          /> */}
        </>
      );
    }
    case InputTypes.checkbox: {
      return props.baseObject.getItems().map((value, index) => {
        return (
          <label
            {...props.baseObject.getItemLabelProps(index)}
            key={`${value}${index}`}
          >
            {props.baseObject.isSingle
              ? props.baseObject.getObject().title
              : value}
            <input {...props.baseObject.getItemInputProps(index)} />
          </label>
        );
      });
    }
    default:
      return <></>;
  }
}

function ObjectRenderer(props: any) {
  const methods = useObject({
    pointer: props.pointer,
    UISchema: props.UISchema,
  });

  return (
    <div className="flex flex-row w-full gap-4">
      {methods.map((obj) => (
        <div key={`${obj.type}${obj.pointer}`}>
          <SpecializedObject baseObject={obj} />
          {obj.getError() && <p>This is an error!</p>}
        </div>
      ))}
    </div>
  );
}

export default function FormBuilder() {
  return (
    <></>
    // <FormContext
    //   schema={personSchema}
    //   onSubmit={({ data }) => {
    //     logger.log(data);
    //   }}
    // >
    //   <Box className="w-full">
    //     <ObjectRenderer pointer="#" UISchema={UISchema} />
    //   </Box>
    //   <Button type="submit">Submit</Button>
    // </FormContext>
  );
}
