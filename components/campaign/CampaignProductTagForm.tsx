import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { storeThemes } from "@prisma/client";
import { 
    Button,
    BlockStack
} from "@shopify/polaris";
import { CampaignProduct } from "@/lib/types";
import MultiselectTagComboboxExample from "@/components/VerticalCombobox";

const CampaignProductTagForm: FC<{ product: CampaignProduct }> = ({ product }) => {
    const { handleSubmit, setValue, watch } = useForm<{
        tags: string[];
    }>({ defaultValues: { tags: [...product.tags] } });
    const tags = watch("tags");

    const [originalTags, setOriginalTags] = useState<string[]>([...product.tags]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tagsChanged, setTagsChanged] = useState<boolean>(false);

    const { mutate: updateProductTags } = useMutation<
      {
        product?: CampaignProduct;
        error?: { code: string; message: string };
      },
      any,
      { prod_id: string }
    >(
      (variables) =>
        fetch(`/api/apps/product/prod_id}/updatetags`, {
            method: "POST",
            body: JSON.stringify({
                data: variables.prod_id
            }),
        }).then((response) => response.json()),
      {
        onSuccess: (data) => {
          console.log("API has been called successfully", data);
        },
      }
    );
    // const { data = { theme: {} } } = useQuery<{ theme: storeThemes }>({
    //     queryKey: "theme",
    //     queryFn: () =>
    //         fetch(`/api/apps/campaigns/list`).then((response) => response.json()),
    // })

    useEffect(() => {
        setTagsChanged(tagsAreNotEqual());
    }, [tags]);

    function tagsAreNotEqual() {
        if(tags.length !== originalTags.length) return true;

        let equal = false;
        tags.forEach((tag, index) => {
            if(tag !== originalTags[index]) equal = true;
        })

        return equal;
    }

    function changeSelection(selection: string) {
        const nextSelectedTags = new Set([...tags]);
  
        if (nextSelectedTags.has(selection)) {
          nextSelectedTags.delete(selection);
        } else {
          nextSelectedTags.add(selection);
        }
        setValue("tags", ([...Array.from(nextSelectedTags)]));
    }


    const onSubmit = handleSubmit(async (fields: { tags: string[] }) => {
        const prod_id = product.id.split("/").reverse()[0];
        console.log("on submitting");
        updateProductTags({ prod_id });
    });
    // const onSubmit = handleSubmit((fields: { domain: string }) => {
    //     updateStoreDomain(
    //       { domain: fields.domain },
    //       {
    //         onSuccess: (response) => {
    //           if (response.error) return;
    //           triggerToast("Domain updated");
    //           if (firstTimeSetup) setTimeout(() => router.push("/app"), 1500);
    //         },
    //       }
    //     );
    //   });

    return (
        <BlockStack gap="400" inlineAlign="end">
            <div style={{ width: "100%" }}>
                <MultiselectTagComboboxExample 
                    selectedTags={tags}
                    onChange={changeSelection}
                />
            </div>
            
            <Button 
                variant="primary" 
                onClick={onSubmit}
                disabled={!tagsChanged}
            >
                Save Tags
            </Button>
        </BlockStack>
        
    )
}

export default CampaignProductTagForm;